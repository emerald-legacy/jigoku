import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { CardType, Players } from '../../Constants.js';

class WildfireKick extends DrawCard {
    static id = 'wildfire-kick';

    setupCardAbilities() {
        this.action('Give opponent\'s characters -2/-2')
            .condition((context) =>
                !!this.game.currentConflict &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3)
            .target({
                controller: Players.Self,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            })
            .cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent).filter((card) => card.militarySkill <= (context.target?.militarySkill ?? 0) && card !== context.source) ?? [],
                effect: modifyBothSkills(-2)
            }))
            .chatText((context) => {
                const targetMs = context.target.militarySkill;
                const affected = this.game.currentConflict?.getCharacters(context.player.opponent).filter((card) => card.militarySkill <= targetMs && card !== context.source) ?? [];
                return msg`give ${context.player.opponent}'s participating characters -2${'military'}/-2${'political'} if their military skill is equal to or lower than ${targetMs}. This affects: ${affected}`;
            });
    }
}


export default WildfireKick;
