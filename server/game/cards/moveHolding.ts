import type { AbilityContext } from '../AbilityContext.js';
import AbilityDsl from '../abilitydsl.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Location, Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

/** The holding's 'Move holding to another province' action, moving it to another of its controller's non-stronghold provinces. */
export function moveHoldingAction(holding: DrawCard) {
    return holding.action('Move holding to another province')
        .target({
            location: Location.Provinces,
            cardType: CardType.Province,
            controller: Players.Self,
            cardCondition: (card, context) =>
                card.location !== context.source.location && card.location !== Location.StrongholdProvince
        })
        .gameAction(AbilityDsl.actions.moveCard((context) => ({
            target: context.source,
            destination: context.target.location
        })));
}

/** The other faceup holdings its controller has in the source's province. */
export function otherHoldingsInSameProvince(context: AbilityContext): BaseCard[] {
    return context.game.allCards.filter(
        (card) =>
            card.location === context.source.location &&
            card.controller === context.source.controller &&
            card.type === CardType.Holding &&
            !card.facedown &&
            card !== context.source
    );
}
