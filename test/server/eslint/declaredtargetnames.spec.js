import { RuleTester } from 'eslint';
import rule from '../../../eslint/declared-target-names.cjs';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = fit;

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } });

ruleTester.run('declared-target-names', rule, {
    valid: [
        'this.action("x").target({ cardType: 1 }).handler((context) => context.targets.target)',
        'this.action("x").target({ name: "character" }).target({ name: "other" }).effect("e", (context) => [context.targets.character, context.targets.other])',
        'const CHARACTER = "character"; this.action("x").target({ name: CHARACTER }).effect("e", (context) => [context.targets[CHARACTER], context.targets.character])',
        'this.action("x").ringTarget({ name: "ring" }).handler((context) => context.rings.ring)',
        'this.action("x").select({ name: "select" }, {}).handler((context) => context.selects.select)',
        'this.action("x").target({}).condition((context) => context.game.rings.air.isClaimed())',
        'this.action("x").handler((context) => context.targets.anything)'
    ],
    invalid: [
        {
            code: 'this.action("x").target({ name: "character" }).handler((context) => context.targets.charcter)',
            errors: [{ messageId: 'undeclared', data: { bag: 'targets', name: 'charcter', declared: 'character' } }]
        },
        {
            code: 'this.action("x").target({ name: "character" }, foo((context) => ({ target: context.targets.target })))',
            errors: [{ messageId: 'undeclared', data: { bag: 'targets', name: 'target', declared: 'character' } }]
        },
        {
            code: 'this.action("x").target({ name: "character" }).handler((context) => context.rings.target)',
            errors: [{ messageId: 'undeclared', data: { bag: 'rings', name: 'target', declared: 'none' } }]
        },
        {
            code: 'this.action("x").select({ name: "select" }, {}).handler((context) => context.selects.target)',
            errors: [{ messageId: 'undeclared', data: { bag: 'selects', name: 'target', declared: 'select' } }]
        }
    ]
});
