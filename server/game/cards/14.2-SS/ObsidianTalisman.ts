import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ObsidianTalisman extends DrawCard {
    static id = 'obsidian-talisman';

    setupCardAbilities() {
        this.action('Discard attached character\'s token')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(context => !!context.source.parentCharacter)
            .gameAction(AbilityDsl.actions.selectToken(context => ({
                card: context.source.parentCharacter ?? undefined,
                activePromptTitle: 'Which token do you wish to discard?',
                message: '{0} discards {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: AbilityDsl.actions.discardStatusToken()
            })))
            .effect('discard a status token from {1}', context => [context.source.parentCharacter])
            .limit(AbilityDsl.limit.perRound(Infinity));
    }
}


export default ObsidianTalisman;


