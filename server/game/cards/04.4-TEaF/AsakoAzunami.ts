import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Element } from '../../Constants.js';

const elementKey = 'asako-azunami-water';

class AsakoAzunami extends DrawCard {
    static id = 'asako-azunami';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Bow and ready two characters instead of the ring effect',
            when: {
                onResolveRingElement: (event, context) => !!event.ring && event.ring.element === this.getCurrentElementSymbol(elementKey) && event.player === context.player
            },
            effect: 'replace the {1} ring effect with bowing and readying two characters',
            effectArgs: () => [this.getCurrentElementSymbol(elementKey)],
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to bow',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: AbilityDsl.actions.bow(),
                        targets: true,
                        message: '{0} chooses to bow {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    }),
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: AbilityDsl.actions.ready(),
                        targets: true,
                        message: '{0} chooses to ready {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })
                ])
            }))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Resolved Ring',
            element: Element.Water
        });
        return symbols;
    }
}


export default AsakoAzunami;
