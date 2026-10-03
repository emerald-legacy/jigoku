import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class WebisusBlessing extends DrawCard {
    static id = 'webisu-s-blessing';

    setupCardAbilities() {
        this.action('Discard status tokens')
            .tokenTarget('first', {
                activePromptTitle: 'Choose a status token'
            }, AbilityDsl.actions.discardStatusToken())
            .tokenTarget('second', {
                activePromptTitle: 'Choose a status token',
                dependsOn: 'first',
                optional: true,
                tokenCondition: (token, context) => token !== (context?.tokens.first)?.[0]
            }, AbilityDsl.actions.discardStatusToken())
            .effect('discard {1}\'s {2}{3}{4}{5}{6}', (context) =>
                context.tokens.second
                    ? [
                        (context.tokens.first)[0].card,
                        context.tokens.first,
                        ' and ',
                        (context.tokens.second)[0].card,
                        '\'s ',
                        context.tokens.second
                    ]
                    : [(context.tokens.first)[0].card, context.tokens.first, '', '', '', '']);
    }
}
