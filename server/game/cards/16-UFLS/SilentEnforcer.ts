import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { bow, sendHome } from '../../GameActions/GameActions.js';

class SilentEnforcer extends DrawCard {
    static id = 'silent-enforcer';

    setupCardAbilities() {
        this.reaction('Bow or move home a character')
            .when({
                onCardPlayed: (event, context) => event.card.type === CardType.Event && event.card.controller === context.player && context.source.isParticipating()
            })
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.costLessThan(4)
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Move this character home': sendHome(context => ({ target: context.targets.character })),
                'Bow this character': bow(context => ({ target: context.targets.character }))
            });
    }
}


export default SilentEnforcer;
