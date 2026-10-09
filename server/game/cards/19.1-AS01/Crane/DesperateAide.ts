import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { gainAbility } from '../../../effects.js';
import { draw, gainHonor, sequential } from '../../../GameActions/GameActions.js';
import { CardType, EffectName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.composure({
            effect: gainAbility.action('Draw a card', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .gameAction(sequential([
                    draw((context) => ({ target: context.player })),
                    gainHonor((context) => ({
                        amount: this.controllerHasHigherPol(context) ? 1 : 0,
                        target: context.player
                    }))
                ]))
                .chatText((context) => msg`draw 1 card${this.controllerHasHigherPol(context) ? ' and gain 1 honor' : ''}`))
        });
    }

    private controllerHasHigherPol(context: AbilityContext): boolean {
        return (
            !context.player.opponent ||
            this.currentPoliticalSkill(context.player) > this.currentPoliticalSkill(context.player.opponent)
        );
    }

    /** As the conflict counts it: bowed characters count only if they can contribute while bowed. */
    private currentPoliticalSkill(player: Player): number {
        return player.cardsInPlay.reduce(
            (total, card) =>
                card.type === CardType.Character && card.isParticipating() && (!card.bowed || card.anyEffect(EffectName.CanContributeWhileBowed))
                    ? total + card.politicalSkill
                    : total,
            0
        );
    }
}
