import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Elements } from '../../Constants.js';

const elementKey = 'asako-tsuki-water';

class AsakoTsuki extends DrawCard {
    static id = 'asako-tsuki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a scholar character',
            when: {
                onClaimRing: event => (event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(elementKey))) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey))
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('scholar'),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}


export default AsakoTsuki;
