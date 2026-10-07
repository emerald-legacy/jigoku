import { CardType, ConflictType, Duration, EventName, Location, Players } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { cannotTriggerAbilities } from '../../../effects.js';
import { cardLastingEffect, claimRing, joint, putIntoPlay } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class TheEmptyCity extends ProvinceCard {
    static id = 'the-empty-city';

    private invokedSpirit?: BaseCard;

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnRoundEnded, EventName.OnCardLeavesPlay]);

        const sharedLimit = perRound(1);

        this.action('Claim a ring')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('spirit')
            }))
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: (ring) => ring.isUnclaimed()
            }, claimRing({
                takeFate: false,
                type: ConflictType.Political
            }))
            .effect('claim {0} as a political ring')
            .limit(sharedLimit)
            .canTriggerOutsideConflict();

        this.action('Put a Spirit character into play')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait('spirit') && (card.getCost() ?? 0) <= 3
            }, joint([
                putIntoPlay(),
                cardLastingEffect((context) => ({
                    target: context.source,
                    effect: cannotTriggerAbilities(),
                    duration: Duration.UntilEndOfRound
                }))
            ]))
            .effect('put {0} into play')
            .onResolve((context) => {
                this.invokedSpirit = context.target;
            })
            .limit(sharedLimit)
            .canTriggerOutsideConflict();
    }

    public onRoundEnded() {
        this.invokedSpirit = undefined;
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(this.invokedSpirit && this.invokedSpirit === event.card && this.location !== Location.RemovedFromGame) {
            this.game.addMessage(
                '{1} is removed from the game, as it was invoked by the {0} this round',
                this,
                event.card
            );
            this.owner.moveCard(event.card, Location.RemovedFromGame);
        }
    }
}
