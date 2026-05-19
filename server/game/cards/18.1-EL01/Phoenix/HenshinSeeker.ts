import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Elements } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

const RING_CLAIM = 'henshin-seeker-fire';

export default class HenshinSeeker extends DrawCard {
    static id = 'henshin-seeker';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onClaimRing: (event) => {
                    const element = this.getCurrentElementSymbol(RING_CLAIM);
                    return (event.conflict && event.conflict.hasElement(element)) || event.ring.hasElement(element);
                }
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.hasSomeTrait('scholar', 'monk'),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({ key: RING_CLAIM, prettyName: 'Ring', element: Elements.Fire });
        return symbols;
    }
}
