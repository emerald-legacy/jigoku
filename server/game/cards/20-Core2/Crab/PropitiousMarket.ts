import type { AbilityContext } from '../../../AbilityContext.js';
import { Location, Phases, Players, TargetMode, TokenType } from '../../../Constants.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { addToken, gainFate, sacrifice } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

function amountOfFateGain(holding: DrawCard) {
    return holding.getTokenCount(TokenType.Honor);
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
            .then((context) => ({
                target: {
                    mode: TargetMode.Select,
                    activePromptTitle: 'Sacrifice ' + context.source.name + '?',
                    choices: {
                        Yes: sacrifice({ target: context.source }),
                        No: () => true
                    }
                },
                message: '{0} chooses {3}to sacrifice {1}',
                messageArgs: (context) => [context.select === 'No' ? 'not ' : ''],
                then: (subThenContext: AbilityContext<this>) => ({
                    gameAction: gainFate({ amount: amountOfFateGain(subThenContext.source) }),
                    message: '{0} uses {1} to gain {3} fate',
                    messageArgs: [amountOfFateGain(subThenContext.source)]
                })
            }))
            .phase(Phases.Conflict);
    }
}
