import { IntegrationBase } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async create(query: {
    type: string;
    amount: number;
    currency: string;
    metadata: object;
    owner: object;
    redirect: object;
    statementDescriptor: string
  }) {
    return await this.stripe.sources.create({
      type: query.type,
      amount: query.amount,
      currency: query.currency,
      metadata: query.metadata as Stripe.MetadataParam || undefined,
      owner: query.owner as Stripe.SourceCreateParams.Owner || undefined,
      redirect: query.redirect as Stripe.SourceCreateParams.Redirect || undefined,
      statement_descriptor: query.statementDescriptor
    })
  }

  async read(query: { id: string }) {
    return await this.stripe.sources.retrieve(query.id)
  }

  async update(query: {
    id: string;
    amount: number;
    metadata: object;
    owner: object;
  }) {
    return await this.stripe.sources.update(query.id, {
      amount: query.amount,
      metadata: query.metadata as Stripe.MetadataParam,
      owner: query.owner
    })
  }

  async attach(query: { customer: string; source: string; }) {
    return await this.stripe.customers.createSource(query.customer, {
      source: query.source
    })
  }

  async detach(query: { customer: string; source: string; }) {
    return await this.stripe.customers.deleteSource(query.customer, query.source)
  }
}

export default CustomIntegration