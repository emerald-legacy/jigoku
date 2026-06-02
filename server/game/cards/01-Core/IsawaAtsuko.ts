import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';

const elementKey = 'isawa-atsuko-void';

class IsawaAtsuko extends DrawCard {
    static id = 'isawa-atsuko';

    setupCardAbilities() {
        this.action({
            title: 'Wield the power of the void',
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            effect: 'give friendly characters +1/+1 and opposing characters -1/-1',
            gameAction: [
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: this.game.currentConflict?.getCharacters(context.player) ?? [],
                    effect: AbilityDsl.effects.modifyBothSkills(1)
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                    effect: AbilityDsl.effects.modifyBothSkills(-1)
                }))
            ]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Void
        });
        return symbols;
    }
}


export default IsawaAtsuko;
