import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityType, CardType, EffectName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Draw a card',
                condition: (context) => context.source.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.draw((context) => ({ target: context.player })),
                    AbilityDsl.actions.gainHonor((context) => ({
                        amount: this.controllerHasHigherPol(context) ? 1 : 0,
                        target: context.player
                    }))
                ]),
                effect: 'draw 1 card{1}',
                effectArgs: (context) => [this.controllerHasHigherPol(context) ? ' and gain 1 honor' : '']
            })
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
