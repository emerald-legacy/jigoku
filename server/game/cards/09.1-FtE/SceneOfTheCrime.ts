import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class SceneOfTheCrime extends ProvinceCard {
    static id = 'scene-of-the-crime';

    public setupCardAbilities() {
        this.reaction('Look at opponent\'s hand')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .lookAt((context) => ({
                target: (context.player.opponent?.hand ?? []).slice().sort((a, b) => a.name.localeCompare(b.name))
            }))
            .chatText((context) => msg`look at ${context.player.opponent ?? ''}'s hand`);
    }
}
