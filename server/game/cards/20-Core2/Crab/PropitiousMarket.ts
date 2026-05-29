import type { AbilityContext } from '../../../AbilityContext.js';
import { Locations, Phases, Players, TargetModes, TokenTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

function amountOfFateGain(holding: DrawCard) {
    return holding.getTokenCount(TokenTypes.Honor);
}

export default class PropitiousMarket extends DrawCard {
    static id = 'propitious-market';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            match: (card, context) => !!context && card instanceof ProvinceCard && card.location === context?.source.location,
            effect: AbilityDsl.effects.modifyProvinceStrength(() => this.getTokenCount(TokenTypes.Honor))
        });

        this.action({
            title: 'Place an honor token',
            phase: Phases.Conflict,
            gameAction: AbilityDsl.actions.addToken(),
            then: (context: AbilityContext) => ({
                target: {
                    mode: TargetModes.Select,
                    activePromptTitle: 'Sacrifice ' + context.source.name + '?',
                    choices: {
                        Yes: AbilityDsl.actions.sacrifice({ target: context.source }),
                        No: () => true
                    }
                },
                message: '{0} chooses {3}to sacrifice {1}',
                messageArgs: (context: AbilityContext) => (context.select === 'No' ? 'not ' : ''),
                then: (subThenContext: AbilityContext) => ({
                    gameAction: AbilityDsl.actions.gainFate({ amount: amountOfFateGain(subThenContext.source) }),
                    message: '{0} uses {1} to gain {3} fate',
                    messageArgs: [amountOfFateGain(subThenContext.source)]
                })
            })
        });
    }
}
