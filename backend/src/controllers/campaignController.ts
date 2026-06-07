import { Request, Response } from 'express';
import CampaignModel from '../models/campaignModel';
import mongoose from 'mongoose';

class CampaignController {
  // Create a new campaign
  async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { intake, metrics, plan, versions } = req.body;
      const doc = await CampaignModel.create({
        userId,
        intake: intake || {},
        metrics: metrics || {},
        plan: plan || {},
        versions: versions || [],
      });
      res.status(201).json({ success: true, campaign: doc });
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Failed to create campaign', details: error.message });
    }
  }

  // Get all campaigns
  async getAllCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const campaigns = await CampaignModel.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, count: campaigns.length, campaigns });
    } catch (error: any) {
      console.error('Error listing campaigns:', error);
      res.status(500).json({ error: 'Failed to retrieve campaigns', details: error.message });
    }
  }

  // Get a single campaign by ID
  async getCampaign(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid campaign ID format' });
        return;
      }
      const campaign = await CampaignModel.findOne({ _id: id, userId });
      if (!campaign) {
        res.status(404).json({ error: 'Campaign not found' });
        return;
      }
      res.json({ success: true, campaign });
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ error: 'Failed to fetch campaign', details: error.message });
    }
  }

  // Update a campaign
  async updateCampaign(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid campaign ID format' });
        return;
      }
      const updates = req.body;
      const updatedCampaign = await CampaignModel.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { new: true }
      );
      if (!updatedCampaign) {
        res.status(404).json({ error: 'Campaign not found' });
        return;
      }
      res.json({ success: true, campaign: updatedCampaign });
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      res.status(500).json({ error: 'Failed to update campaign', details: error.message });
    }
  }

  // Delete a campaign
  async deleteCampaign(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid campaign ID format' });
        return;
      }
      const deleted = await CampaignModel.findOneAndDelete({ _id: id, userId });
      if (!deleted) {
        res.status(404).json({ error: 'Campaign not found' });
        return;
      }
      res.json({ success: true, message: 'Campaign deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({ error: 'Failed to delete campaign', details: error.message });
    }
  }
}

export default new CampaignController();
