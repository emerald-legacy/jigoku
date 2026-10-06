import DrawCard from '../../../DrawCard.js';
import { CardType, Phases, Players } from '../../../Constants.js';
import { bow, injure } from '../../../GameActions/GameActions.js';
import Ring from '../../../Ring.js';

export default class AkodoTadakatsu extends DrawCard {
    static id = 'akodo-tadakatsu';

    setupCardAbilities() {
        this.reaction('Injure a character')
            .when({
                onMoveFate: (event, context) => {
                    if(context.game.currentPhase === Phases.Fate || event.origin !== context.source || (event.fate ?? 0) <= 0) {
                        return false;
                    }
                    const cause = event.context;
                    return !!cause && !!context.player.opponent && cause.player === context.player.opponent &&
                        (cause.source instanceof Ring || cause.ability.isCardAbility());
                }
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character
            }, injure());

        this.reaction('Injure or bow a character')
            .when({
                onConflictStarted: (_event, context) => context.source.isAttacking()
            })
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: card => card.isDefending()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Injure this character': injure((context) => ({ target: context.targets.character })),
                'Bow this character': bow((context) => ({ target: context.targets.character }))
            });
    }
}
