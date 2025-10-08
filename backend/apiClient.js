// API Client for Frontend Integration
// Copy this file to each frontend app's src/ directory

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

class APIClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  logout() {
    this.setToken(null);
  }

  // Niches (Product 1 - NicheFinder)
  async getNiches() {
    return this.request('/niches');
  }

  async getNiche(id) {
    return this.request(`/niches/${id}`);
  }

  async createNiche(nicheData) {
    return this.request('/niches', {
      method: 'POST',
      body: JSON.stringify(nicheData)
    });
  }

  async updateNiche(id, nicheData) {
    return this.request(`/niches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(nicheData)
    });
  }

  async deleteNiche(id) {
    return this.request(`/niches/${id}`, {
      method: 'DELETE'
    });
  }

  async exportNicheToCampaign(id) {
    return this.request(`/niches/${id}/export`, {
      method: 'POST'
    });
  }

  // Campaigns (Product 2 - CampaignMaster)
  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaign(id) {
    return this.request(`/campaigns/${id}`);
  }

  async createCampaign(campaignData) {
    return this.request('/campaigns/create', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  async launchCampaign(id) {
    return this.request(`/campaigns/${id}/launch`, {
      method: 'POST'
    });
  }

  async pauseCampaign(id) {
    return this.request(`/campaigns/${id}/pause`, {
      method: 'POST'
    });
  }

  async updateCampaignStats(id, stats) {
    return this.request(`/campaigns/${id}/stats`, {
      method: 'POST',
      body: JSON.stringify(stats)
    });
  }

  async deleteCampaign(id) {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE'
    });
  }

  // Trends (Product 3 - TrendScout)
  async discoverTrends(sources = 'all') {
    return this.request(`/trends/discover?sources=${sources}`);
  }

  async getTrends(limit = 50, source = null) {
    let url = `/trends?limit=${limit}`;
    if (source) url += `&source=${source}`;
    return this.request(url);
  }

  async exportTrendToNiche(id) {
    return this.request(`/trends/${id}/export`, {
      method: 'POST'
    });
  }

  async scanClickBank() {
    return this.request('/trends/scan/clickbank');
  }

  async scanGoogleTrends(keywords = null) {
    let url = '/trends/scan/google-trends';
    if (keywords) url += `?keywords=${keywords}`;
    return this.request(url);
  }

  async scanReddit(subreddits = null) {
    let url = '/trends/scan/reddit';
    if (subreddits) url += `?subreddits=${subreddits}`;
    return this.request(url);
  }

  // Integrations
  async getIntegrations() {
    return this.request('/integrations');
  }

  async connectClickBank(apiKey, accountNickname) {
    return this.request('/integrations/clickbank/connect', {
      method: 'POST',
      body: JSON.stringify({ apiKey, accountNickname })
    });
  }

  async connectBingAds(apiKey, customerId, accountId) {
    return this.request('/integrations/bing/connect', {
      method: 'POST',
      body: JSON.stringify({ apiKey, customerId, accountId })
    });
  }

  async connectFacebookAds(accessToken, adAccountId) {
    return this.request('/integrations/facebook/connect', {
      method: 'POST',
      body: JSON.stringify({ accessToken, adAccountId })
    });
  }

  async connectGoogleAds(clientId, clientSecret, refreshToken, customerId) {
    return this.request('/integrations/google/connect', {
      method: 'POST',
      body: JSON.stringify({ clientId, clientSecret, refreshToken, customerId })
    });
  }

  async disconnectIntegration(platform) {
    return this.request(`/integrations/${platform}`, {
      method: 'DELETE'
    });
  }

  async testIntegration(platform) {
    return this.request(`/integrations/${platform}/test`);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Also export class for testing
export default APIClient;
