import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Element } from '../../../Constants.js';
import {
    conditional,
    draw,
    honor,
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

    override setupCardAbilities() {
        this.action('Gain boons based on your currently claimed rings')
            .gainHonor((context) => ({
                target: context.player,
                amount: hasClaimedRing(this, elementKeys.air, context.player) ? 1 : 0
            }))
            .draw((context) => ({
                target: context.player,
                amount: hasClaimedRing(this, elementKeys.earth, context.player) ? 1 : 0
            }))
            .gainFate((context) => ({
                target: context.player,
                amount: hasClaimedRing(this, elementKeys.void, context.player) ? 1 : 0
            }))
            .gameAction(conditional({
                condition: (context) => hasClaimedRing(this, elementKeys.water, context.player),
                trueGameAction: selectCard({
                    activePromptTitle: 'Choose a 2 cost or lower character to ready',
                    cardCondition: (card) => card.isCharacter() && card.costLessThan(3),
                    cardType: CardType.Character,
                    gameAction: ready(),
                    targets: false,
                    message: (context, card, player) => msg`${player} chooses to ready ${card} with ${context.source}'s effect`
                }),
                falseGameAction: draw(() => ({ amount: 0 }))
            }))
            .gameAction(conditional({
                condition: (context) => hasClaimedRing(this, elementKeys.fire, context.player),
                trueGameAction: selectCard({
                    activePromptTitle: 'Choose a character to honor',
                    cardType: CardType.Character,
                    gameAction: honor(),
                    targets: false,
                    message: (context, card, player) => msg`${player} chooses to honor ${card} with ${context.source}'s effect`
                }),
                falseGameAction: draw(() => ({ amount: 0 }))
            }))
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

    protected override printedElementSymbols = [
        {
            key: elementKeys.air,
            prettyName: '+1 honor',
            element: Element.Air
        },
        {
            key: elementKeys.earth,
            prettyName: 'draw a card',
            element: Element.Earth
        },
        {
            key: elementKeys.fire,
            prettyName: 'honor a character',
            element: Element.Fire
        },
        {
            key: elementKeys.water,
            prettyName: 'ready a 2 cost or less character',
            element: Element.Water
        },
        {
            key: elementKeys.void,
            prettyName: '+1 fate',
            element: Element.Void
        }
    ];
}

export default AsakoReina;
