import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Phases } from '../../Constants.js';

class CommanderOfTheLegions extends DrawCard {
    static id = 'commander-of-the-legions';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard, context) => card.isFaction('lion')
            && card !== context?.source
            && card.controller === context?.player,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: context =>
                !!(context.game.currentPhase === Phases.Fate && context.player.opponent
                && context.player.honor >= context.player.opponent.honor + 5),
            match: (card: DrawCard, context) =>
                card.type === CardType.Character
                && card.isFaction('lion')
                && (card.printedCost ?? 0) <= 3
                && card !== context?.source
                && card.controller === context?.player,
            effect: AbilityDsl.effects.cardCannot('removeFate')
        });
    }
}


export default CommanderOfTheLegions;
