import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityTypes, CardTypes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { ActionProps } from '../../../Interfaces.js';
import type Player from '../../../player.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
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
            } as ActionProps<this>)
        });
    }

    private controllerHasHigherPol(context: AbilityContext): boolean {
        return (
            !context.player.opponent ||
            this.participatingPolSkillTotal(context.player) > this.participatingPolSkillTotal(context.player.opponent)
        );
    }

    private participatingPolSkillTotal(player: Player): number {
        return player.cardsInPlay.reduce(
            (total, card) =>
                card.type === CardTypes.Character && card.isParticipating() ? total + card.politicalSkill : total,
            0
        );
    }
}
