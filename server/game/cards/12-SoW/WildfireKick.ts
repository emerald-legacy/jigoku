import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';
import type Player from '../../Player.js';

class WildfireKick extends DrawCard {
    static id = 'wildfire-kick';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Give opponent\'s characters -2/-2',
            condition: context =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3,
            target: {
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            },
            gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>(context => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent).filter((card: DrawCard) => card.getMilitarySkill() <= (context.target?.getMilitarySkill() ?? 0) && card !== context.source) ?? [],
                effect: AbilityDsl.effects.modifyBothSkills(-2)
            })),
            effect: 'give {1}\'s participating characters -2{2}/-2{3} if their military skill is equal to or lower than {4}. This affects: {5}',
            effectArgs: context => {
                const target = context.target;
                const targetMs = target?.getMilitarySkill() ?? 0;
                return [context.player.opponent as Player, 'military', 'political', targetMs, this.game.currentConflict?.getCharacters(context.player.opponent).filter((card: DrawCard) => card.getMilitarySkill() <= targetMs && card !== context.source) ?? []];
            }
        });
    }
}


export default WildfireKick;
