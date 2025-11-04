// Integração com PRTG Network Monitor
interface PRTGConfig {
  url: string
  username: string
  password: string
}

interface PRTGSensor {
  objid: number
  name: string
  status: string
  lastvalue: string
  device: string
}

export class PRTGIntegration {
  private config: PRTGConfig

  constructor(config: PRTGConfig) {
    this.config = config
  }

  private getAuthParams(): string {
    return `username=${this.config.username}&password=${this.config.password}`
  }

  async getSensors(): Promise<PRTGSensor[]> {
    const response = await fetch(
      `${this.config.url}/api/table.json?content=sensors&output=json&columns=objid,name,status,lastvalue,device&${this.getAuthParams()}`
    )

    const data = await response.json()
    return data.sensors
  }

  async getDevices(): Promise<any[]> {
    const response = await fetch(
      `${this.config.url}/api/table.json?content=devices&output=json&columns=objid,name,status,host&${this.getAuthParams()}`
    )

    const data = await response.json()
    return data.devices
  }

  async getAlerts(): Promise<any[]> {
    const response = await fetch(
      `${this.config.url}/api/table.json?content=messages&output=json&columns=datetime,parent,type,name,status,message&${this.getAuthParams()}`
    )

    const data = await response.json()
    return data.messages
  }

  async getSensorHistory(sensorId: number, days: number = 7): Promise<any[]> {
    const response = await fetch(
      `${this.config.url}/api/historicdata.json?id=${sensorId}&avg=3600&sdate=today-${days}d&edate=today&${this.getAuthParams()}`
    )

    const data = await response.json()
    return data.histdata
  }
}
