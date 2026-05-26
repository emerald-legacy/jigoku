import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class WildfireKick extends DrawCard {
    static id = 'wildfire-kick';

    setupCardAbilities() {
        this.action({
            title: 'Give opponent\'s characters -2/-2',
            condition: context =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3,
            target: {
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent).filter((card: DrawCard) => card.getMilitarySkill() <= context.target.getMilitarySkill() && card !== context.source) ?? [],
                effect: AbilityDsl.effects.modifyBothSkills(-2)
            })),
            effect: 'give {1}\'s participating characters -2{2}/-2{3} if their military skill is equal to or lower than {4}. This affects: {5}',
            effectArgs: context => [context.player.opponent, 'military', 'political', context.target.getMilitarySkill(), this.game.currentConflict?.getCharacters(context.player.opponent).filter((card: DrawCard) => card.getMilitarySkill() <= context.target.getMilitarySkill() && card !== context.source) ?? []]
        });
    }
}


export default WildfireKick;
