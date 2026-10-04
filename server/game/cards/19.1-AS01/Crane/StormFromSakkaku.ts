import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { EventName, AbilityType, Location, CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';
import { EventRegistrar } from '../../../EventRegistrar.js';

export default class StormFromSakkaku extends DrawCard {
    static id = 'storm-from-sakkaku';

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([
            { [`${EventName.OnResolveRingElement}:${AbilityType.WouldInterrupt}`]: 'cancelRingEffect' }
        ]);

        this.action('Move holding to another province')
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.location !== context.source.location && card.location !== Location.StrongholdProvince
            })
            .gameAction(AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: context.target.location
            })))
            .then(() => ({
                gameAction: AbilityDsl.actions.discardCard((context) => ({
                    target: this.otherHoldingsInSameProvince(context)
                })),
                message: 'The {1} {3}',
                messageArgs: (context) => [
                    this.otherHoldingsInSameProvince(context).length > 0
                        ? 'is angry and discards the holdings that they find in the province'
                        : 'calms down'
                ]
            }));
    }

    private otherHoldingsInSameProvince(context: AbilityContext): BaseCard[] {
        return context.game.allCards.filter(
            (card) =>
                card.location === context.source.location &&
                card.controller === context.source.controller &&
                card.type === CardType.Holding &&
                !card.facedown &&
                card !== context.source
        );
    }

    public cancelRingEffect(event: Event) {
        if(event.context?.game.currentConflict && this.isInConflictProvince() && this.isFaceup() && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}
