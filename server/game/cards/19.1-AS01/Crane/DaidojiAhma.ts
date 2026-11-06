import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class DaidojiAhma extends DrawCard {
    static id = 'daidoji-ahma';

    public override setupCardAbilities() {
        this.wouldInterrupt('Cancel ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.isCardAbility() &&
                    event.cardTargets.some((card) => this.targetIsDishonoredCrane(card, context)),
                onMoveFate: (event, context) =>
                    this.isRingEffect(event) && (event.fate ?? 0) > 0 && event.origin?.isCard() && this.targetIsDishonoredCrane(event.origin, context),
                onCardHonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardDishonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardBowed: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardReadied: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context)
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.context.source.isRing() ? 'the ' : ''}${context.event.context.source}`);
    }

    private isRingEffect(event: { context?: AbilityContext }): boolean {
        return !!event.context?.source.isRing();
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
