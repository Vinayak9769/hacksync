import mongoose from 'mongoose';
import MarketingPlanModel, { IMarketingPlan } from '../models/marketingPlanModel';

class MarketingPlanService {
  /**
   * Save a marketing plan
   */
  async savePlan(
    userId: string,
    data: {
      title: string;
      plan: string;
      brandName?: string;
      campaignName?: string;
      collectedInfo?: any;
    }
  ): Promise<IMarketingPlan> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not available. Please ensure MongoDB is connected.');
    }

    const plan = new MarketingPlanModel({
      userId,
      title: data.title,
      plan: data.plan,
      brandName: data.brandName,
      campaignName: data.campaignName,
      collectedInfo: data.collectedInfo || {},
    });

    return await plan.save();
  }

  /**
   * Get all marketing plans for a user
   */
  async getAllPlans(userId: string): Promise<IMarketingPlan[]> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return [];
    }
    return await MarketingPlanModel.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get a plan by ID and user
   */
  async getPlanById(userId: string, id: string): Promise<IMarketingPlan | null> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return null;
    }
    return await MarketingPlanModel.findOne({ _id: id, userId });
  }

  /**
   * Delete a plan
   */
  async deletePlan(userId: string, id: string): Promise<boolean> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return false;
    }
    const result = await MarketingPlanModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  /**
   * Update a plan
   */
  async updatePlan(userId: string, id: string, updates: Partial<IMarketingPlan>): Promise<IMarketingPlan | null> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return null;
    }
    return await MarketingPlanModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }
}

export default new MarketingPlanService();
