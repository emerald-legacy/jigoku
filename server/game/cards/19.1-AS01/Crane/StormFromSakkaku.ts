import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { EventName, AbilityType, Location, CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class StormFromSakkaku extends DrawCard {
    static id = 'storm-from-sakkaku';

    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            { [`${EventName.OnResolveRingElement}:${AbilityType.WouldInterrupt}`]: 'cancelRingEffect' }
        ]);

        this.action({
            title: 'Move holding to another province',
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.location !== context.source.location && card.location !== Location.StrongholdProvince
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: context.target.location
            })),
            then: {
                gameAction: AbilityDsl.actions.discardCard((context) => ({
                    target: this.otherHoldingsInSameProvince(context)
                })),
                message: 'The {1} {3}',
                messageArgs: (context: TriggeredAbilityContext<this>) => [
                    this.otherHoldingsInSameProvince(context).length > 0
                        ? 'is angry and discards the holdings that they find in the province'
                        : 'calms down'
                ]
            }
        });
    }

    private otherHoldingsInSameProvince(context: AbilityContext<this>): BaseCard[] {
        return (context.game.allCards as BaseCard[]).filter(
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
