'use strict';

// `context.targets` etc. are typed as open records, so a misspelled target name typechecks.
// This rule checks the names read in an ability declaration against the ones it declares.

const BAG_OF_METHOD = {
    target: 'targets',
    targetCards: 'targets',
    abilityTarget: 'targets',
    ringTarget: 'rings',
    tokenTarget: 'tokens',
    select: 'selects',
    selectIf: 'selects',
    selectFrom: 'selects'
};

function constString(node, scopeManager) {
    if(!node) {
        return undefined;
    }
    if(node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }
    if(node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0].value.cooked;
    }
    if(node.type === 'Identifier') {
        let scope = scopeManager.acquire(node, true);
        for(let current = node.parent; !scope && current; current = current.parent) {
            scope = scopeManager.acquire(current, true);
        }
        for(; scope; scope = scope.upper) {
            const variable = scope.set.get(node.name);
            if(variable) {
                const def = variable.defs[0];
                if(def && def.type === 'Variable' && def.parent.kind === 'const') {
                    return constString(def.node.init, scopeManager);
                }
                return undefined;
            }
        }
    }
    return undefined;
}

function declaredName(call, scopeManager) {
    const props = call.arguments[0];
    if(!props || props.type !== 'ObjectExpression') {
        return null;
    }
    const nameProp = props.properties.find((prop) =>
        prop.type === 'Property' && !prop.computed && prop.key.type === 'Identifier' && prop.key.name === 'name');
    if(!nameProp) {
        return 'target';
    }
    return constString(nameProp.value, scopeManager) ?? null;
}

/** The outermost call of a `this.action(…).target(…)…` chain that contains `node`. */
function chainRoot(node) {
    let current = node;
    while(current.parent && (
        (current.parent.type === 'MemberExpression' && current.parent.object === current) ||
        (current.parent.type === 'CallExpression' && current.parent.callee === current)
    )) {
        current = current.parent;
    }
    return current;
}

module.exports = {
    meta: {
        type: 'problem',
        docs: { description: 'read only target names the ability declares' },
        schema: [],
        messages: {
            undeclared: '`{{bag}}.{{name}}` is not declared by this ability (declared: {{declared}})'
        }
    },
    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const chains = new Map();
        const pending = [];

        function chainFor(node) {
            const root = chainRoot(node);
            if(!chains.has(root)) {
                chains.set(root, { root, declared: { targets: new Set(), rings: new Set(), tokens: new Set(), selects: new Set() }, unknown: new Set(), reads: [] });
            }
            return chains.get(root);
        }

        return {
            CallExpression(node) {
                const callee = node.callee;
                if(callee.type !== 'MemberExpression' || callee.computed || callee.property.type !== 'Identifier') {
                    return;
                }
                const bag = BAG_OF_METHOD[callee.property.name];
                if(!bag) {
                    return;
                }
                const chain = chainFor(node);
                const name = declaredName(node, sourceCode.scopeManager);
                if(name === null) {
                    chain.unknown.add(bag);
                } else {
                    chain.declared[bag].add(name);
                }
            },
            MemberExpression(node) {
                const object = node.object;
                // `context.targets.x`, not `context.game.rings.x`
                if(object.type !== 'MemberExpression' || object.computed || object.property.type !== 'Identifier' || object.object.type !== 'Identifier') {
                    return;
                }
                const bag = object.property.name;
                if(!['targets', 'rings', 'tokens', 'selects'].includes(bag)) {
                    return;
                }
                const name = node.computed ? constString(node.property, sourceCode.scopeManager) : node.property.name;
                if(name === undefined) {
                    return;
                }
                pending.push({ node, bag, name, ancestors: sourceCode.getAncestors(node) });
            },
            'Program:exit'() {
                for(const read of pending) {
                    // the innermost declaration chain the read sits in
                    const call = [...read.ancestors].reverse().find((ancestor) => ancestor.type === 'CallExpression' && chains.has(chainRoot(ancestor)));
                    if(call) {
                        chains.get(chainRoot(call)).reads.push(read);
                    }
                }
                for(const chain of chains.values()) {
                    for(const { node, bag, name } of chain.reads) {
                        const declared = chain.declared[bag];
                        if(chain.unknown.has(bag) || declared.has(name)) {
                            continue;
                        }
                        context.report({
                            node,
                            messageId: 'undeclared',
                            data: { bag, name, declared: [...declared].join(', ') || 'none' }
                        });
                    }
                }
            }
        };
    }
};
