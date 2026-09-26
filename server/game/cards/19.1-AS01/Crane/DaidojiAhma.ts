import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import Ring from '../../../Ring.js';

export default class DaidojiAhma extends DrawCard {
    static id = 'daidoji-ahma';

    public setupCardAbilities() {
        this.wouldInterrupt('Cancel ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    event.cardTargets.some((card) => this.targetIsDishonoredCrane(card, context)),
                onMoveFate: (event, context) =>
                    this.isRingEffect(event) && (event.fate ?? 0) > 0 && event.origin instanceof BaseCard && this.targetIsDishonoredCrane(event.origin, context),
                onCardHonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardDishonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardBowed: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardReadied: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context)
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of {1}{2}', (context) => [
                context.event.context.source instanceof Ring ? 'the ' : '',
                context.event.context.source
            ]);
    }

    private isRingEffect(event: { context?: AbilityContext }): boolean {
        return event.context?.source instanceof Ring;
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
