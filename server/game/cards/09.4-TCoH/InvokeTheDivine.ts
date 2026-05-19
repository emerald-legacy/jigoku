import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import { Locations, Players } from '../../Constants.js';

class InvokeTheDivine extends DrawCard {
    static id = 'invoke-the-divine';

    setupCardAbilities() {
        const getSelectCardAction = (fate, spellsCast) => AbilityDsl.actions.selectCard({
            location: Locations.Hand,
            controller: Players.Self,
            cardCondition: card => card.hasTrait('spell') && card.getCost() <= fate,
            optional: spellsCast > 0,
            gameAction: AbilityDsl.actions.playCard(invokeContext => ({
                resetOnCancel: true,
                payCosts: false,
                source: this,
                postHandler: context => {
                    if(spellsCast < 2) {
                        getSelectCardAction(fate - context.source.getCost(), spellsCast + 1).resolve(null, invokeContext);
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

