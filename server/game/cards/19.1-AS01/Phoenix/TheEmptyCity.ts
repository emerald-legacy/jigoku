import { CardType, ConflictType, Duration, EventName, Location, Players } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class TheEmptyCity extends ProvinceCard {
    static id = 'the-empty-city';

    private invokedSpirit?: BaseCard;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnRoundEnded, EventName.OnCardLeavesPlay]);

        const sharedLimit = AbilityDsl.limit.perRound(1);

        this.action('Claim a ring')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('spirit')
            }))
            .ringTarget('target', {
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: (ring) => ring.isUnclaimed()
            }, AbilityDsl.actions.claimRing({
                takeFate: false,
                type: ConflictType.Political
            }))
            .effect('claim {0} as a political ring')
            .limit(sharedLimit)
            .canTriggerOutsideConflict();

        this.action('Put a Spirit character into play')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait('spirit') && (card.getCost() ?? 0) <= 3
            }, AbilityDsl.actions.joint([
                AbilityDsl.actions.putIntoPlay(),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    effect: AbilityDsl.effects.cannotTriggerAbilities(),
                    duration: Duration.UntilEndOfRound
                }))
            ]))
            .effect('put {0} into play')
            .then((context) => {
                this.invokedSpirit = context.target;
                return { gameAction: AbilityDsl.actions.noAction() };
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
