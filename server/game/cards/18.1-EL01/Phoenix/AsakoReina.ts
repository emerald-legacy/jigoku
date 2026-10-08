import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Element } from '../../../Constants.js';
import {
    conditional,
    draw,
    gainFate,
    gainHonor,
    honor,
    multiple,
    ready,
    selectCard
} from '../../../GameActions/GameActions.js';
import { hasClaimedRing } from '../../claimedRings.js';
import { msg } from '../../../GameChat.js';

const elementKeys = {
    air: 'asako-reina-air',
    earth: 'asako-reina-earth',
    fire: 'asako-reina-fire',
    water: 'asako-reina-water',
    void: 'asako-reina-void'
};

class AsakoReina extends DrawCard {
    static id = 'asako-reina';

    setupCardAbilities() {
        this.action('Gain boons based on your currently claimed rings')
            .gameAction(multiple([
                gainHonor((context) => ({
                    target: context.player,
                    amount: hasClaimedRing(this, elementKeys.air, context.player) ? 1 : 0
                })),
                draw((context) => ({
                    target: context.player,
                    amount: hasClaimedRing(this, elementKeys.earth, context.player) ? 1 : 0
                })),
                gainFate((context) => ({
                    target: context.player,
                    amount: hasClaimedRing(this, elementKeys.void, context.player) ? 1 : 0
                })),
                conditional({
                    condition: (context) => hasClaimedRing(this, elementKeys.water, context.player),
                    trueGameAction: selectCard((context) => ({
                        activePromptTitle: 'Choose a 2 cost or lower character to ready',
                        cardCondition: (card) => card.isCharacter() && card.costLessThan(3),
                        cardType: CardType.Character,
                        gameAction: ready(),
                        targets: false,
                        message: '{0} chooses to ready {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })),
                    falseGameAction: draw(() => ({ amount: 0 }))
                }),
                conditional({
                    condition: (context) => hasClaimedRing(this, elementKeys.fire, context.player),
                    trueGameAction: selectCard((context) => ({
                        activePromptTitle: 'Choose a character to honor',
                        cardType: CardType.Character,
                        gameAction: honor(),
                        targets: false,
                        message: '{0} chooses to honor {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })),
                    falseGameAction: draw(() => ({ amount: 0 }))
                })
            ]))
            .chatText((context) => msg`${this.createEffectMessage(context)}`);
    }

    private createEffectMessage(context: AbilityContext) {
        const boons = [
            [elementKeys.air, 'gain 1 honor'],
            [elementKeys.earth, 'draw 1 card'],
            [elementKeys.void, 'gain 1 fate'],
            [elementKeys.fire, 'honor a character'],
            [elementKeys.water, 'ready a character']
        ].filter(([key]) => hasClaimedRing(this, key, context.player)).map(([, boon]) => boon);

        if(boons.length <= 1) {
            return boons.join('');
        }
        return `${boons.slice(0, -1).join(', ')} and ${boons[boons.length - 1]}`;
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.air,
            prettyName: '+1 honor',
            element: Element.Air
        });
        symbols.push({
            key: elementKeys.earth,
            prettyName: 'draw a card',
            element: Element.Earth
        });
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'honor a character',
            element: Element.Fire
        });

        symbols.push({
            key: elementKeys.water,
            prettyName: 'ready a 2 cost or less character',
            element: Element.Water
        });

        symbols.push({
            key: elementKeys.void,
            prettyName: '+1 fate',
            element: Element.Void
        });
        return symbols;
    }
}

export default AsakoReina;
