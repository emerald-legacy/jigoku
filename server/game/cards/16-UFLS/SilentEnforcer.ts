import DrawCard from '../../DrawCard.js';
import { Players, TargetModes, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SilentEnforcer extends DrawCard {
    static id = 'silent-enforcer';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow or move home a character',
            when: {
                onCardPlayed: (event, context) => event.card.type === CardTypes.Event && event.card.controller === context.player && context.source.isParticipating()
            },
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: card => card.isParticipating() && card.costLessThan(4)
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: context => (context.targets.character as DrawCard).controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Move this character home': AbilityDsl.actions.sendHome(context => ({ target: context.targets.character })),
                        'Bow this character': AbilityDsl.actions.bow(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default SilentEnforcer;
