import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import { Locations, Players } from '../../Constants.js';

class InvokeTheDivine extends DrawCard {
    static id = 'invoke-the-divine';

    setupCardAbilities() {
        const getSelectCardAction = (fate: number, spellsCast: number) => AbilityDsl.actions.selectCard({
            location: Locations.Hand,
            controller: Players.Self,
            cardCondition: (card: DrawCard) => card.hasTrait('spell') && (card.getCost() ?? 0) <= fate,
            optional: spellsCast > 0,
            gameAction: AbilityDsl.actions.playCard(invokeContext => ({
                resetOnCancel: true,
                payCosts: false,
                source: this,
                postHandler: (context: any) => {
                    if(spellsCast < 2) {
                        getSelectCardAction(fate - (context.source.getCost() ?? 0), spellsCast + 1).resolve(undefined, invokeContext);
                    }
                }
            }))
        });
        this.action({
            title: 'Play 3 spells',
            effect: 'play 3 spells from their hand',
            gameAction: getSelectCardAction(5, 0)
        });
    }
}


export default InvokeTheDivine;

