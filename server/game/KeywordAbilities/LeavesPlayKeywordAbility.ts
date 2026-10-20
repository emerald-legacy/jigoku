import { msg } from '../GameChat.js';
import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityType, type EventName, Location } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import type { GameAction } from '../GameActions/GameAction.js';
import { TriggeredAbility } from '../TriggeredAbility.js';
import type { EventPayload } from '../Events/EventPayloads.js';

interface LeavesPlayKeyword {
    name: string;
    hasKeyword(card: DrawCard): boolean;
    /** What the chat says the player gets: "gains a fate" in "{player} gains a fate due to {card}'s Courtesy". */
    gain: string;
    gameAction(context: TriggeredAbilityContext): GameAction;
}

/** Where a card can go when it leaves play. */
const OUT_OF_PLAY = [Location.Hand, Location.ConflictDeck, Location.DynastyDeck, Location.ConflictDiscardPile, Location.DynastyDiscardPile,
    Location.RemovedFromGame, Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree, Location.ProvinceFour, Location.StrongholdProvince];

/**
 * A keyword that gives its controller something when the card leaves play (Courtesy, Sincerity).
 * It resolves after the card has left play, before reactions (RRG Courtesy, Sincerity), so it uses the card as it left play:
 * its keywords and controller then, and no in-play restriction stops it (Kuni Wasteland; ruling #780).
 */
export class LeavesPlayKeywordAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard, keyword: LeavesPlayKeyword) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context: TriggeredAbilityContext<DrawCard>) =>
                    event.card === context.source && !!event.cardStateWhenLeftPlay &&
                    keyword.hasKeyword(event.cardStateWhenLeftPlay) && context.player === event.cardStateWhenLeftPlay.controller
            },
            location: OUT_OF_PLAY,
            anyPlayer: true,
            limit: AbilityLimit.unlimited(),
            title: card.name + '\'s ' + keyword.name,
            printedAbility: false,
            message: (context: TriggeredAbilityContext) => msg`${context.player} ${keyword.gain} due to ${context.source}'s ${keyword.name}`,
            handler: (context: TriggeredAbilityContext) => context.game.resolveActions([keyword.gameAction(context)], context)
        });
    }

    override isTriggeredAbility() {
        return false;
    }

    override isKeywordAbility() {
        return true;
    }
}
