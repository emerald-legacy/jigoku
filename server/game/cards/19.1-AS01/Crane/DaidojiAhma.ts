import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class DaidojiAhma extends DrawCard {
    static id = 'daidoji-ahma';

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets as Array<BaseCard>).some((card) => this.targetIsDishonoredCrane(card, context)),
                onMoveFate: (event, context) =>
                    this.isRingEffect(event) && event.fate > 0 && this.targetIsDishonoredCrane(event.origin as BaseCard, context),
                onCardHonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardDishonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardBowed: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardReadied: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context)
            },
            gameAction: AbilityDsl.actions.cancel(),
            effect: 'cancel the effects of {1}{2}',
            effectArgs: (context) => [
                ((context.event.context as AbilityContext).source.type as string) === 'ring' ? 'the ' : '',
                (context.event.context as AbilityContext).source
            ]
        });
    }

    private isRingEffect(event: any): boolean {
        return event.context.source.type === 'ring';
    }

    private targetIsDishonoredCrane(card: BaseCard, context: TriggeredAbilityContext<this>): boolean {
        return (
            card.isDishonored &&
            card.controller === context.player &&
            card.location === Location.PlayArea &&
            card.isFaction('crane')
        );
    }
}
