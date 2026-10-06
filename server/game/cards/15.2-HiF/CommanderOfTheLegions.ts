import DrawCard from '../../DrawCard.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { CardType, Phases } from '../../Constants.js';

class CommanderOfTheLegions extends DrawCard {
    static id = 'commander-of-the-legions';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.isFaction('lion')
            && card !== context?.source
            && card.controller === context?.player,
            effect: modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: context =>
                !!(context.game.currentPhase === Phases.Fate && context.player.opponent
                && context.player.honor >= context.player.opponent.honor + 5),
            match: (card, context) =>
                card.type === CardType.Character
                && card.isFaction('lion')
                && (card.printedCost ?? 0) <= 3
                && card !== context?.source
                && card.controller === context?.player,
            effect: cardCannot('removeFate')
        });
    }
}


export default CommanderOfTheLegions;
