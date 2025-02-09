import { Api } from '../../../Api'
import { BaseQueryNodeFixture, FixtureRunner } from '../../../Fixture'
import { QueryNodeApi } from '../../../QueryNodeApi'
import { IMember } from '../createMembers'
import { PlaceBidsInAuctionFixture } from './placeBidsInAuction'
import BN from 'bn.js'
import { assertNftOwner } from './utils'
import { assert } from 'chai'
import { Utils } from '../../../utils'

export class CreateVideoWithNftFixture extends BaseQueryNodeFixture {
  private author: IMember
  private channelId: number

  constructor(api: Api, query: QueryNodeApi, author: IMember, channelId: number) {
    super(api, query)
    this.author = author
    this.channelId = channelId
  }

  /*
    Execute this Fixture.
  */
  public async execute(): Promise<void> {
    // SCENARIO 1
    this.debug('Create video with NFT (in Idle state)')
    const videoCreatedWithNftResponse = await this.api.createVideoWithNft(
      this.author.keyringPair.address,
      this.author.memberId.toNumber(),
      this.channelId
    )

    const videoCreatedWithNftEvent = await this.api.getEvent(videoCreatedWithNftResponse, 'content', 'VideoCreated')

    this.debug('Check NFT ownership')
    await assertNftOwner(this.query, videoCreatedWithNftEvent.data[2].toNumber(), this.author)

    // SCENARIO 2
    this.debug('Create video with NFT being auctioned')
    const { auctionParams } = await this.api.createEnglishAuctionParameters()

    const videoCreatedWithAuctionedNftResponse = await this.api.createVideoWithNft(
      this.author.keyringPair.address,
      this.author.memberId.toNumber(),
      this.channelId,
      auctionParams
    )

    const videoCreatedWithAuctionedNftEvent = await this.api.getEvent(
      videoCreatedWithAuctionedNftResponse,
      'content',
      'VideoCreated'
    )

    this.debug('Check NFT ownership')
    await assertNftOwner(this.query, videoCreatedWithAuctionedNftEvent.data[2].toNumber(), this.author, (ownedNft) => {
      Utils.assert(ownedNft.transactionalStatusAuction, 'NFT not in auctioned state')
    })
  }
}
