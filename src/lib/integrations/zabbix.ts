// Integração com Zabbix API
interface ZabbixConfig {
  url: string
  username: string
  password: string
  token?: string
}

interface ZabbixHost {
  hostid: string
  host: string
  name: string
  status: string
  available: string
}

interface ZabbixItem {
  itemid: string
  name: string
  key_: string
  lastvalue: string
  units: string
}

export class ZabbixIntegration {
  private config: ZabbixConfig
  private authToken?: string

  constructor(config: ZabbixConfig) {
    this.config = config
  }

  async authenticate(): Promise<string> {
    const response = await fetch(`${this.config.url}/api_jsonrpc.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'user.login',
        params: {
          username: this.config.username,
          password: this.config.password,
        },
        id: 1,
      }),
    })

    const data = await response.json()
    this.authToken = data.result
    return this.authToken || ''
  }

  async getHosts(): Promise<ZabbixHost[]> {
    if (!this.authToken) {
      await this.authenticate()
    }

    const response = await fetch(`${this.config.url}/api_jsonrpc.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'host.get',
        params: {
          output: ['hostid', 'host', 'name', 'status', 'available'],
          selectInterfaces: ['ip'],
        },
        auth: this.authToken,
        id: 1,
      }),
    })

    const data = await response.json()
    return data.result
  }

  async getHostItems(hostid: string): Promise<ZabbixItem[]> {
    if (!this.authToken) {
      await this.authenticate()
    }

    const response = await fetch(`${this.config.url}/api_jsonrpc.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'item.get',
        params: {
          output: ['itemid', 'name', 'key_', 'lastvalue', 'units'],
          hostids: hostid,
          monitored: true,
        },
        auth: this.authToken,
        id: 1,
      }),
    })

    const data = await response.json()
    return data.result
  }

  async getAlerts(limit: number = 50): Promise<any[]> {
    if (!this.authToken) {
      await this.authenticate()
    }

    const response = await fetch(`${this.config.url}/api_jsonrpc.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alert.get',
        params: {
          output: 'extend',
          sortfield: 'clock',
          sortorder: 'DESC',
          limit: limit,
        },
        auth: this.authToken,
        id: 1,
      }),
    })

    const data = await response.json()
    return data.result
  }
}
