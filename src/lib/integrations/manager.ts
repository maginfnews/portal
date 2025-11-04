// Gerenciador de Integrações
import { ZabbixIntegration } from './zabbix'
import { PRTGIntegration } from './prtg'
import { VeeamIntegration } from './veeam'
import { prisma } from '@/lib/prisma'

interface IntegrationConfig {
  id: string
  tenantId: string
  type: 'zabbix' | 'prtg' | 'veeam' | 'nagios' | 'custom'
  name: string
  config: any
  active: boolean
}

export class IntegrationManager {
  async getIntegrations(tenantId: string): Promise<IntegrationConfig[]> {
    const configs = await prisma.integrationConfig.findMany({
      where: {
        tenantId: tenantId,
        ativo: true
      }
    })

    return configs.map(config => ({
      id: config.id,
      tenantId: config.tenantId,
      type: config.tipo as any,
      name: config.provedor,
      config: {
        apiKey: config.apiKey,
        endpointBase: config.endpointBase
      },
      active: config.ativo
    }))
  }

  async createIntegration(data: Omit<IntegrationConfig, 'id'>): Promise<IntegrationConfig> {
    const integration = await prisma.integrationConfig.create({
      data: {
        tenantId: data.tenantId,
        tipo: data.type,
        provedor: data.name,
        apiKey: data.config.apiKey || null,
        endpointBase: data.config.endpointBase || null,
        ativo: data.active
      }
    })

    return {
      id: integration.id,
      tenantId: integration.tenantId,
      type: integration.tipo as any,
      name: integration.provedor,
      config: {
        apiKey: integration.apiKey,
        endpointBase: integration.endpointBase
      },
      active: integration.ativo
    }
  }

  async getZabbixData(tenantId: string): Promise<any> {
    const integrations = await this.getIntegrations(tenantId)
    const zabbixConfig = integrations.find(i => i.type === 'zabbix')
    
    if (!zabbixConfig) {
      throw new Error('Integração Zabbix não configurada')
    }

    const zabbix = new ZabbixIntegration(zabbixConfig.config)
    
    const [hosts, alerts] = await Promise.all([
      zabbix.getHosts(),
      zabbix.getAlerts(20)
    ])

    return {
      servers: hosts.map(host => ({
        id: host.hostid,
        nome: host.name,
        ip: host.host,
        status: host.available === '1' ? 'online' : 'offline',
        tipo: 'servidor',
        ultimaAtualizacao: new Date().toISOString()
      })),
      alerts: alerts.map(alert => ({
        id: alert.alertid,
        tipo: 'error',
        titulo: 'Alerta Zabbix',
        descricao: alert.message,
        timestamp: new Date(parseInt(alert.clock) * 1000).toISOString(),
        resolvido: false
      }))
    }
  }

  async getPRTGData(tenantId: string): Promise<any> {
    const integrations = await this.getIntegrations(tenantId)
    const prtgConfig = integrations.find(i => i.type === 'prtg')
    
    if (!prtgConfig) {
      throw new Error('Integração PRTG não configurada')
    }

    const prtg = new PRTGIntegration(prtgConfig.config)
    
    const [sensors, devices, alerts] = await Promise.all([
      prtg.getSensors(),
      prtg.getDevices(),
      prtg.getAlerts()
    ])

    return {
      servers: devices.map(device => ({
        id: device.objid.toString(),
        nome: device.name,
        ip: device.host,
        status: device.status === 'Up' ? 'online' : 'offline',
        tipo: 'servidor',
        ultimaAtualizacao: new Date().toISOString()
      })),
      sensors: sensors.map(sensor => ({
        id: sensor.objid.toString(),
        nome: sensor.name,
        valor: sensor.lastvalue,
        status: sensor.status,
        dispositivo: sensor.device
      })),
      alerts: alerts.slice(0, 20).map(alert => ({
        id: alert.datetime,
        tipo: alert.type === 'Error' ? 'error' : 'warning',
        titulo: alert.name,
        descricao: alert.message,
        timestamp: alert.datetime,
        resolvido: false
      }))
    }
  }

  async getVeeamData(tenantId: string): Promise<any> {
    const integrations = await this.getIntegrations(tenantId)
    const veeamConfig = integrations.find(i => i.type === 'veeam')
    
    if (!veeamConfig) {
      throw new Error('Integração Veeam não configurada')
    }

    const veeam = new VeeamIntegration(veeamConfig.config)
    
    const [jobs, repositories] = await Promise.all([
      veeam.getJobs(),
      veeam.getRepositories()
    ])

    return {
      backupJobs: jobs.map(job => ({
        id: job.Id,
        nome: job.Name,
        tipo: job.JobType,
        status: job.LastResult === 'Success' ? 'sucesso' : 'erro',
        ultimaExecucao: job.LastRun,
        proximaExecucao: job.NextRun,
        tamanho: '0 GB' // Seria calculado baseado nas sessões
      })),
      repositories: repositories.map(repo => ({
        id: repo.Id,
        nome: repo.Name,
        capacidadeTotal: repo.Capacity || '0 GB',
        espacoLivre: repo.FreeSpace || '0 GB'
      }))
    }
  }
}
