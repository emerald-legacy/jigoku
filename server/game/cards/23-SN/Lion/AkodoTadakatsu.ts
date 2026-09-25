import DrawCard from '../../../DrawCard.js';
import { CardType, Phases, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AkodoTadakatsu extends DrawCard {
    static id = 'akodo-tadakatsu';

    setupCardAbilities() {
        this.reaction('Injure a character')
            .when({
                onMoveFate: (event, context) => {
                    if(context.game.currentPhase === Phases.Fate || event.origin !== context.source || event.fate <= 0) {
                        return false;
                    }
                    const cause = event.context;
                    return !!cause && !!context.player.opponent && cause.player === context.player.opponent &&
                        ((cause.source.type as string) === 'ring' || cause.ability.isCardAbility());
                }
            })
            .target('target', {
                controller: Players.Opponent,
                cardType: CardType.Character
            }, AbilityDsl.actions.injure());

        this.reaction('Injure or bow a character')
            .when({
                onConflictStarted: (event, context) => context.source.isAttacking()
            })
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                cardCondition: card => card.isDefending()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Injure this character': AbilityDsl.actions.injure((context) => ({ target: context.targets.character })),
                'Bow this character': AbilityDsl.actions.bow((context) => ({ target: context.targets.character }))
            });
    }
}
