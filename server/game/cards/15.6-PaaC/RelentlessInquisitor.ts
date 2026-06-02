import DrawCard from '../../DrawCard.js';
import { Players, TargetMode, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RelentlessInquisitor extends DrawCard {
    static id = 'relentless-inquisitor';

    setupCardAbilities() {
        this.action({
            title: 'Remove a fate from or bow a character',
            condition: context => context.source.isParticipating(),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating() && !card.bowed
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Remove a fate from this character': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character })),
                        'Bow this character': AbilityDsl.actions.bow(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default RelentlessInquisitor;
