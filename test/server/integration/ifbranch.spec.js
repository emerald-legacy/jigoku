import { AbilityBuilder, toActionProps, createDraft } from '../../../build/server/game/AbilityBuilder.js';
import { ConditionalAction } from '../../../build/server/game/GameActions/ConditionalAction.js';
import { bow } from '../../../build/server/game/GameActions/GameActions.js';

describe('if() and otherwise() in the ability builder', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.context = this.game.getFrameworkContext(this.player1.player);

            this.draft = createDraft('Test', () => true);
            this.builder = new AbilityBuilder(this.draft);
        });

        it('puts the branches in one conditional action after the actions before if()', function() {
            this.builder.draw(1)
                .if(() => true)
                .gainHonor(2)
                .otherwise()
                .gainFate(2)
                .draw(2);

            const [draw, branches] = toActionProps(this.draft).gameAction;
            expect(draw).not.toEqual(jasmine.any(ConditionalAction));
            expect(branches).toEqual(jasmine.any(ConditionalAction));
            expect(branches.getGameAction(this.context).name).toBe('gainHonor');
        });

        it('resolves the otherwise() actions when the condition fails', function() {
            this.builder.if(() => false)
                .gainHonor(2)
                .otherwise()
                .gainFate(2)
                .draw(2);

            const [branches] = toActionProps(this.draft).gameAction;
            const otherwise = branches.getGameAction(this.context);
            expect(otherwise.getProperties(this.context).gameActions.map((action) => action.name)).toEqual(['gainFate', 'draw']);
        });

        it('does nothing without otherwise() when the condition fails', function() {
            this.builder.if(() => false).gainHonor(2);

            const [branches] = toActionProps(this.draft).gameAction;
            expect(branches.getGameAction(this.context).isNoAction).toBe(true);
        });

        it('rejects otherwise() without if(), a second if() and targets after if()', function() {
            expect(() => this.builder.otherwise()).toThrowError('Test: otherwise() follows an if()');
            this.builder.if(() => true);
            expect(() => this.builder.if(() => true)).toThrowError('Test: one if() per step');
            expect(() => this.builder.select({}, {})).toThrowError('Test: targets come before if()');
        });

        it('puts the branches on a card target declared without game actions', function() {
            this.builder.target({ cardType: 'character' })
                .if(() => true)
                .gainHonor(1)
                .otherwise()
                .draw(1);

            const properties = toActionProps(this.draft);
            expect(properties.gameAction).toBeUndefined();
            expect(properties.target.gameAction).toEqual(jasmine.any(ConditionalAction));
        });

        it('adds the branches to a card target with game actions, after its own', function() {
            this.builder.target({ cardType: 'character' }, bow())
                .if(() => true)
                .gainHonor(1);

            const properties = toActionProps(this.draft);
            expect(properties.gameAction).toBeUndefined();
            const [own, branches] = properties.target.gameAction;
            expect(own.name).toBe('bow');
            expect(branches).toEqual(jasmine.any(ConditionalAction));
        });

        it('keeps the branches on the ability when it has game actions of its own', function() {
            this.builder.target({ cardType: 'character' }, bow())
                .draw(1)
                .if(() => true)
                .gainHonor(1);

            const properties = toActionProps(this.draft);
            expect(properties.gameAction[1]).toEqual(jasmine.any(ConditionalAction));
            expect(properties.target.gameAction).not.toEqual(jasmine.any(Array));
        });

        it('keeps the branches on the ability after several targets without game actions', function() {
            this.builder.target({ name: 'first', cardType: 'character' })
                .target({ name: 'second', cardType: 'character' })
                .if(() => true)
                .gainHonor(1);

            const properties = toActionProps(this.draft);
            expect(properties.gameAction[0]).toEqual(jasmine.any(ConditionalAction));
            expect(properties.targets.first.gameAction).toBeUndefined();
            expect(properties.targets.second.gameAction).toBeUndefined();
        });

        it('rejects a branch without game actions', function() {
            this.builder.if(() => true).otherwise().gainFate(1);

            expect(() => toActionProps(this.draft)).toThrowError('Test: if() and otherwise() each need a game action');
        });
    });
});
