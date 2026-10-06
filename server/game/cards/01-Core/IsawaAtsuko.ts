import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Element } from '../../Constants.js';

const elementKey = 'isawa-atsuko-void';

class IsawaAtsuko extends DrawCard {
    static id = 'isawa-atsuko';

    setupCardAbilities() {
        this.action('Wield the power of the void')
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .gameAction(cardLastingEffect(context => ({
                target: this.game.currentConflict?.getCharacters(context.player) ?? [],
                effect: modifyBothSkills(1)
            })), cardLastingEffect(context => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyBothSkills(-1)
            })))
            .effect('give friendly characters +1/+1 and opposing characters -1/-1');
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Void
        });
        return symbols;
    }
}


export default IsawaAtsuko;
