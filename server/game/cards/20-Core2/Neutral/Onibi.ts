import DrawCard from '../../../DrawCard.js';

export default class Onibi extends DrawCard {
    static id = 'onibi';

    public setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .placeFate((context) => ({
                origin: context.player.opponent
            }))
            .chatText('take a fate from {1} and place it on {0}', (context) => context.player.opponent);
    }
}
