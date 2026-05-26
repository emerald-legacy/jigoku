import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    setupCardAbilities() {
        this.reaction({
            title: 'Add fate to a character',
            when: {
                onMoveFate: (event: any, context) =>
                    !context.source.bowed &&
                    event.context?.source.name !== 'Framework effect' &&
                    event.fate > 0 &&
                    event.origin?.type === CardTypes.Character &&
                    event.origin?.controller === context.player &&
                    event.context?.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.placeFate((context: any) => ({ target: context.event.origin }))
        });
    }
}
