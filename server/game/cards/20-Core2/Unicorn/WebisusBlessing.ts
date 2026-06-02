import { TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { StatusToken } from '../../../StatusToken.js';

export default class WebisusBlessing extends DrawCard {
    static id = 'webisu-s-blessing';

    setupCardAbilities() {
        this.action({
            title: 'Discard status tokens',
            targets: {
                first: {
                    activePromptTitle: 'Choose a status token',
                    mode: TargetMode.Token,
                    gameAction: AbilityDsl.actions.discardStatusToken()
                },
                second: {
                    activePromptTitle: 'Choose a status token',
                    dependsOn: 'first',
                    mode: TargetMode.Token,
                    optional: true,
                    tokenCondition: (token, context) => token !== context.tokens.first[0],
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }
            },
            effect: 'discard {1}\'s {2}{3}{4}{5}{6}',
            effectArgs: (context) =>
                context.tokens.second
                    ? [
                        (context.tokens.first as StatusToken[])[0].card as DrawCard,
                        context.tokens.first,
                        ' and ',
                        (context.tokens.second as StatusToken[])[0].card as DrawCard,
                        '\'s ',
                        context.tokens.second
                    ]
                    : [(context.tokens.first as StatusToken[])[0].card as DrawCard, context.tokens.first, '', '', '', '']
        });
    }
}
