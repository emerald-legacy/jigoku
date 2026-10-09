import { JointGameAction } from '../../../build/server/game/GameActions/JointGameAction.js';
import { MultipleGameAction } from '../../../build/server/game/GameActions/MultipleGameAction.js';
import { buildGameActionSpy } from '../../../build/test/server/GameActions/_helpers.js';

describe('CompositeGameAction', function() {
    beforeEach(function() {
        this.context = { player: {}, game: {} };
        this.actionA = buildGameActionSpy();
        this.actionB = buildGameActionSpy();
        this.actionB.hasLegalTarget.and.returnValue(false);
        this.actionB.canAffect.and.returnValue(false);
    });

    it('is legal when any action it holds is', function() {
        const action = new MultipleGameAction([this.actionA, this.actionB]);
        expect(action.hasLegalTarget(this.context)).toBe(true);
        expect(action.canAffect('card', this.context)).toBe(true);
    });

    it('needs every action to be legal for joint()', function() {
        const action = new JointGameAction([this.actionA, this.actionB]);
        expect(action.hasLegalTarget(this.context)).toBe(false);
        expect(action.canAffect('card', this.context)).toBe(false);
    });

    it('passes the overrides on to each action', function() {
        const overrides = { target: 'card' };
        this.actionA.hasLegalTarget.and.returnValue(false);
        new MultipleGameAction([this.actionA, this.actionB]).hasLegalTarget(this.context, overrides);
        expect(this.actionA.hasLegalTarget).toHaveBeenCalledWith(this.context, overrides);
        expect(this.actionB.hasLegalTarget).toHaveBeenCalledWith(this.context, overrides);
    });

    it('lets its actions answer allTargetsLegal, as they may target something else', function() {
        this.actionA.hasLegalTarget.and.returnValue(false);
        expect(new MultipleGameAction([this.actionA, this.actionB]).allTargetsLegal(this.context, { target: 'province' })).toBe(false);
        this.actionA.hasLegalTarget.and.returnValue(true);
        expect(new MultipleGameAction([this.actionA, this.actionB]).allTargetsLegal(this.context, { target: 'province' })).toBe(true);
    });
});
