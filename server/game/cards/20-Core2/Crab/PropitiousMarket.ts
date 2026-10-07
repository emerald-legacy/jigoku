import type { AbilityContext } from '../../../AbilityContext.js';
import { Location, Phases, Players, TokenType } from '../../../Constants.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { addToken, sacrifice } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { msg } from '../../../GameChat.js';
import { stateWhenLeftPlay } from '../../stateWhenLeftPlay.js';

/** One fate for each honor token on the market when it was sacrificed. */
function amountOfFateGain(context: AbilityContext) {
    return stateWhenLeftPlay(context)?.getTokenCount(TokenType.Honor) ?? 0;
}

export default class PropitiousMarket extends DrawCard {
    static id = 'propitious-market';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => !!context && card instanceof ProvinceCard && card.location === context.source.location,
            effect: modifyProvinceStrength(() => this.getTokenCount(TokenType.Honor))
        });

        this.action('Place an honor token')
            .gameAction(addToken())
            .phase(Phases.Conflict)
            .then()
            .select({ activePromptTitle: 'Sacrifice ' + this.name + '?' }, {
                Yes: sacrifice((context) => ({ target: context.source })),
                No: () => true
            })
            .message((context) => msg`${context.player} chooses ${context.select === 'No' ? 'not ' : ''}to sacrifice ${context.source}`)
            .then()
            .gainFate((context) => ({ amount: amountOfFateGain(context) }))
            .message((context) => msg`${context.player} uses ${context.source} to gain ${amountOfFateGain(context)} fate`);
    }
}
