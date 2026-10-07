import DrawCard from '../../DrawCard.js';

export default class GoblinSneak extends DrawCard {
    static id = 'goblin-sneak';

    public setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .placeFate((context) => ({
                origin: context.player.opponent
            }))
            .effect('take a fate from {1} and place it on {0}', (context) => context.player.opponent ?? '');
    }
}
