import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { AbilityType, CardType, EventName, Location, PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class DragonTattoo extends DrawCard {
    static id = 'dragon-tattoo';

    private cardPlayed = true;
    private extraBanzaiTarget?: BaseCard;
    private abilityRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([
            {
                [EventName.OnInitiateAbilityEffects + ':' + AbilityType.WouldInterrupt]: 'onInitiateAbility'
            }
        ]);

        this.attachmentConditions({ myControl: true });

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('tattooed') });

        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event &&
                    event.card.controller === context.player &&
                    (event.card.location === Location.ConflictDiscardPile ||
                        event.card.location === Location.DynastyDiscardPile) &&
                    this.checkTargets(event, context)
            },
            title: 'Play card again',
            gameAction: AbilityDsl.actions.ifAble((context) => {
                const card = context.event.card;
                return {
                    ifAbleAction: AbilityDsl.actions.playCard(() => {
                        this.cardPlayed = true;
                        return {
                            source: this,
                            target: card,
                            resetOnCancel: true,
                            playType: PlayType.Other,
                            destination: Location.RemovedFromGame,
                            payCosts: true,
                            allowReactions: true
                        };
                    }),
                    otherwiseAction: AbilityDsl.actions.moveCard(() => {
                        this.cardPlayed = false;
                        return {
                            target: card,
                            destination: Location.RemovedFromGame
                        };
                    })
                };
            }),
            effect: '{1}{2}{3}',
            effectArgs: (context) => [
                this.cardPlayed ? 'play ' : 'remove ',
                context.event.card?.name ?? '',
                this.cardPlayed ? '' : ' from the game'
            ]
        });
    }

    public onInitiateAbility(event: EventPayload<EventName.OnInitiateAbilityEffects>) {
        if(event.card.id === 'banzai' && event.context) {
            this.extraBanzaiTarget = event.context.targets.target as BaseCard;
        }
    }

    private checkTargets(event: EventPayload<EventName.OnCardPlayed>, context: TriggeredAbilityContext): boolean {
        if(!event.context) {
            return false;
        }

        for(const directTargets of Object.values<BaseCard | BaseCard[]>(event.context.targets)) {
            if(
                Array.isArray(directTargets)
                    ? directTargets.some((card) => this.isValidTargetForTattoo(card, context))
                    : this.isValidTargetForTattoo(directTargets, context)
            ) {
                return true;
            }
        }

        const selects: Record<string, BaseCard | BaseCard[]> = event.context.selects as any;
        for(const selectedTargets of Object.values<BaseCard | BaseCard[]>(selects)) {
            if(
                Array.isArray(selectedTargets)
                    ? selectedTargets.some((card) => this.isValidTargetForTattoo(card, context))
                    : this.isValidTargetForTattoo(selectedTargets, context)
            ) {
                return true;
            }
        }

        if(event.card.id === 'banzai' && this.extraBanzaiTarget) {
            const prevExtraBanzaiTarget = this.extraBanzaiTarget;
            this.extraBanzaiTarget = undefined;
            if(this.isValidTargetForTattoo(prevExtraBanzaiTarget, context)) {
                return true;
            }
        }

        return false;
    }

    private isValidTargetForTattoo(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            card.type === CardType.Character &&
            card.controller === context.player &&
            card === (context.source as DrawCard).parent &&
            card.location === Location.PlayArea
        );
    }
}
