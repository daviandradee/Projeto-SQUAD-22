import { Mark, mergeAttributes } from '@tiptap/core';

export const InterimMark = Mark.create({
  name: 'interimMark',

  // Isso faz com que a marca seja "exclusiva".
  // Se você aplicar 'bold' e 'interimMark', o Tiptap
  // saberá como lidar com isso.
  inclusive: false,

  // Isso define como a marca será renderizada no HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-interim': 'true',
        // O estilo "provisório" que você queria.
        // Cinza e itálico dão uma boa ideia de "pre-confirm".
        'style': 'color: #888; font-style: italic;',
      }),
      0, // 0 significa "aqui vai o conteúdo (texto)"
    ];
  },

  // Isso define como o Tiptap deve ler essa marca do HTML
  // (útil se você for carregar conteúdo salvo)
  parseHTML() {
    return [
      {
        tag: 'span[data-interim]',
      },
    ];
  },
});